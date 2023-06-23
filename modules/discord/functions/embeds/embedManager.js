const { Client, Collection, Events, GatewayIntentBits, EmbedBuilder } = require('discord.js');
require('dotenv').config();

exports.textEmbed = async function (title,description,color,includeTs) {
    const embed = new EmbedBuilder()
		.setTitle(title)
		.setDescription(description)
        .setColor(color)
        .setTimestamp(includeTs)
		.setFooter({ text: `${process.env.FOOTER_CONTENT}` })
	return embed
}

exports.embed = async function (title,description,author,color,includeTs,textUrl,imageUrl,thumbnailUrl) {
    const embed = new EmbedBuilder()
		.setTitle(title)
		.setDescription(description)
        .setColor(color)
        .setImage(imageUrl)
        .setThumbnail(thumbnailUrl)
        .setAuthor(author)
        .setURL(textUrl)
        .setTimestamp(includeTs)
		.setFooter({ text: `${process.env.FOOTER_CONTENT}` })
	return embed
}


exports.fieldEmbed = async function (title,description,color,includeTs,field1,field2,field3,field4) {
    const embed = new EmbedBuilder()
		.setTitle(title)
		.setDescription(description)
        .setColor(color)
        .addFields(field1)
        .addFields(field2)
        .addFields(field3)
        .addFields(field4)
        .setTimestamp(includeTs)
		.setFooter({ text: `${process.env.FOOTER_CONTENT}` })
	return embed
}