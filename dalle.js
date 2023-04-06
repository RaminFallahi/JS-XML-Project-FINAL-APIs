const axios = require('axios');

const openai_api_key = "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";

async function generate_dalle_image(prompt) {
    const response = await axios.post(
        'https://api.openai.com/v1/images/generations',
        {
            prompt: prompt,
            n: 1,
            size: "256x256",
            response_format: "url",
        },
        {
            headers: {
                'Authorization': `Bearer ${openai_api_key}`,
                'Content-Type': 'application/json',
            },
        }
    );

    const image_url = response.data.data[0].url;

    // Download the image
    const image_data = await axios.get(image_url, { responseType: 'arraybuffer' });

    return image_data.data;
}

module.exports = {
    generate_dalle_image,
};
