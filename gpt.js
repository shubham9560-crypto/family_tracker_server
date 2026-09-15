// xpl_7b891054c6baa6d1a07aefd92a2668cf19cbbc6a

import OpenAI from 'openai';
// const OpenAi = require('openai');

const client = new OpenAI({
    baseURL: "https://api.experientiallabs.ai/v1",
    apiKey: "xpl_7b891054c6baa6d1a07aefd92a2668cf19cbbc6a"
});

const response = await client.chat.completions.create({
    model: "gpt-6-astra",
    messages: [{ role: "user", content: "Hello from my product" }]
});
console.log(response.choices[0].message.content);