import { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';
import { getRandomSkin } from '../utils/skinUtils.mjs';

export const randomSkinCommand = {
  data: new SlashCommandBuilder()
    .setName('randomskin')
    .setDescription('Get a random skin'),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      const skin = await getRandomSkin(); // Call without query

      if (skin) {
        const embed = new EmbedBuilder()
          .setTitle(skin.presentationName)
          .setURL(skin.url)
          .setColor("Random")
          .setDescription(`[Download](${skin.url})`)
          .setImage(skin.highResPreview)
          .setFooter({ text: `Random skin` });

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId('another')
            .setLabel('Get Another Random Skin')
            .setStyle(ButtonStyle.Primary)
        );

        const message = await interaction.editReply({ embeds: [embed], components: [row] });

        const collector = message.createMessageComponentCollector({
          time: 60000,
        });

        collector.on('collect', async (buttonInteraction) => {
          if (buttonInteraction.customId === 'another') {
            const newSkin = await getRandomSkin();
            const updatedEmbed = new EmbedBuilder()
              .setTitle(newSkin.presentationName)
              .setURL(newSkin.url)
              .setColor("Random")
              .setDescription(`[Download](${newSkin.url})`)
              .setImage(newSkin.highResPreview)
              .setFooter({ text: `Random skin` });

            await buttonInteraction.update({ embeds: [updatedEmbed] });
          }
        });

        collector.on('end', () => {
          interaction.editReply({ components: [] });
        });

      } else {
        await interaction.editReply(`No skins found.`);
      }
    } catch (error) {
      console.error(error);
      await interaction.editReply('An error occurred while fetching a random skin.');
    }
  }
};
