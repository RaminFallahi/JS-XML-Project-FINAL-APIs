import { Configuration, OpenAIApi } from "openai";
import { writeFileSync } from "fs";
import fetch from "node-fetch";
import fs from "fs";
import { createReadStream } from "fs";

const configuration = new Configuration({
  apiKey: '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',
});

const openai = new OpenAIApi(configuration);

const prompt = "its sunny";

const result = await openai.createImage({
  prompt: prompt,
  numberOfImages: 1,
  size:"1024x1024",
});

const url = result.data.data[0].url;
console.log(url);

//Save the image to a Disk
const imageResult = await fetch(url);
const blob = await imageResult.blob();
const buffer = Buffer.from(await blob.arrayBuffer());
writeFileSync(`./img/${Data.now()}.png`, buffer);

// Error handling
try {
  const response = await openai.createImageVariation(
    fs.createReadStream("image.png"),
    1,
    "1024x1024"
  );
  console.log(response.data.data[0].url);
} catch (error) {
  if (error.response) {
    console.log(error.response.status);
    console.log(error.response.data);
  } else {
    console.log(error.message);
  }
}