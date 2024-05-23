import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from 'src/config';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { StringOutputParser } from '@langchain/core/output_parsers';

const genAI = new GoogleGenerativeAI(config.ai.geminiKey);
const genAILangchain = new ChatGoogleGenerativeAI({
  model: 'models/gemini-pro',
  /**
   * models/gemini-pro => max output token: 2049
   * models/gemini-1.5-pro-latest => max output token: 2049
   * gemini-1.5-flash => max output token: 2049
   */
  apiKey: config.ai.geminiKey,
});
const outputParser = new StringOutputParser();
export const gemini = {
  base: genAI.getGenerativeModel({ model: 'gemini-pro' }),
  langchain: genAILangchain,
  outputParser,
};
