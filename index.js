//import required modules
import { Configuration, OpenAIApi } from "openai";
import { writeFileSync } from "fs";
import { createReadStream } from "fs";
import express from "express";
import path from "path";
import fetch from "node-fetch";
import dotenv from "dotenv";
import { response } from "express";
import request from "request";


dotenv.config();

//set up Express app
const app = express();
const port = process.env.PORT || 8888;

//define important folders
// app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

//setup public folder
app.use(express.static('public'));

const config = new Configuration({
	apiKey: process.env.OpenAiKey,
});

const openai = new OpenAIApi(config);

var links = [
  {
    name: "Home",
    path: "/"
  },
  {
    name: "Result",
    path: "/result"
  },
  {
    name: "About",
    path: "/about"

  }
];

//get openai response
const runPrompt = async () => {
	const prompt = `
        write me a joke about a weather and Toronto's temperature. Return response in the following parsable JSON format:
        {
            "Q": "question",
            "A": "answer"
        }
    `;

	const response = await openai.createCompletion({
		model: "text-davinci-003",
		prompt: prompt,
		max_tokens: 2048,
		temperature: 1,
	});

	const parsableJSONresponse = response.data.choices[0].text;
	const parsedResponse = JSON.parse(parsableJSONresponse);

	//console.log("Question: ", parsedResponse.Q);
	//console.log("Answer: ", parsedResponse.A);
  return parsedResponse;
};

runPrompt();

//get weather data
const getWeather = async () => {
  const apiKey = process.env.OPEN_WEATHER_API_KEY;
  const city = "Toronto";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  const response = await fetch(url);
  const data = await response.json();

  const weather = {
    description: data.weather[0].description,
    temperature: data.main.temp,
  };

  return weather;
};

//MAIN page ROUTE
app.get("/", async (request, response) => {
  response.render("index", { title: "Home", links: links });
});
// result routes
app.get('/result', async (req, res) => {
    const parsedResponse = await runPrompt();
    const weatherData = await getWeather();
    // const htmlContent =
    //     `<h2>Question: ${parsedResponse.Q}</h2>` + `<h1>Answer: ${parsedResponse.A}</h1>`;
    // res.send(htmlContent);
    res.render('result', {
      title: 'Result',
      question: parsedResponse.Q,
      answer: parsedResponse.A,
      weather: weatherData,
  });
});

//about route
app.get("/about", async (request, response) => {
  response.render("about", { title: "About", links: links });
});

//set up server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});