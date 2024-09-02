import { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';
import { getSearch } from '../utils/skinUtils.mjs';

export const skinSearchCommand = {
  data: new SlashCommandBuilder()
    .setName('skinsearch')
    .setDescription('Search for a skin')
    .addStringOption(option =>
      option.setName('query')
        .setDescription('The search query')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('page')
        .setDescription('Page number')
        .setRequired(false))
    .addIntegerOption(option =>
      option.setName('pagesize')
        .setDescription('Number of skins per page')
        .setRequired(false)),

  async execute(interaction) {
    const query = interaction.options.getString('query');
    const page = interaction.options.getInteger('page') || 1;
    const pageSize = interaction.options.getInteger('pagesize') || 5;

    await interaction.deferReply();

    try {
      const data = await getSearch(query, pageSize, page);

      if (data.skins && data.skins.length > 0) {
        let index = 0;

        const generateEmbed = (skin) => {
          return new EmbedBuilder()
            .setTitle(skin.presentationName)
            .setURL(skin.url)
            .setColor("#FF0068")
            .setDescription(`[Download](${skin.url})`)
            .setImage(skin.highResPreview)
            .setFooter({ text: `Skin ${index + 1} of ${data.skins.length} | Query: ${query}` });
        };

        const embed = generateEmbed(data.skins[index]);

        const forwardButton = new ButtonBuilder()
          .setCustomId('forward')
          .setLabel('Next')
          .setStyle(ButtonStyle.Primary);

        const backButton = new ButtonBuilder()
          .setCustomId('backward')
          .setLabel('Previous')
          .setStyle(ButtonStyle.Secondary);

        const row = new ActionRowBuilder().addComponents(backButton, forwardButton);

        const message = await interaction.editReply({ embeds: [embed], components: [row] });

        const collector = message.createMessageComponentCollector({
          time: 60000,
        });

        collector.on('collect', async (buttonInteraction) => {
          if (buttonInteraction.customId === 'forward') {
            index = (index + 1) % data.skins.length;
          } else if (buttonInteraction.customId === 'backward') {
            index = (index - 1 + data.skins.length) % data.skins.length;
          }

          const updatedEmbed = generateEmbed(data.skins[index]);
          await buttonInteraction.update({ embeds: [updatedEmbed] });
        });

        collector.on('end', () => {
          interaction.editReply({ components: [] });
        });

      } else {
        await interaction.editReply(`No skins found for "${query}".`);
      }
    } catch (error) {
      console.error(error);
      await interaction.editReply('An error occurred while searching for skins.');
    }
  }
};
