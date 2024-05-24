import { Injectable } from '@nestjs/common';
import { chatsCollection } from './firebase';
import { Timestamp } from 'firebase-admin/firestore';
import { AITypeEnum, ChatIdModel, ChatModel, ChatRole } from 'src/models';
import { gemini } from './ai';
import { Content } from '@google/generative-ai';
import {
  BaseMessagePromptTemplateLike,
  ChatPromptTemplate,
} from '@langchain/core/prompts';

@Injectable()
export class ChatService {
  //#region private func
  private async countTokenByGemini(text: string) {
    const { totalTokens } = await gemini.base.countTokens(text);
    return totalTokens;
  }

  private async withLangchain(prompt: string, his: ChatIdModel[]) {
    const cxt = ChatPromptTemplate.fromMessages([
      [
        'system',
        `Act as a {career}, please advise me on travel issues.
        Answer the question in a fun way, don't be too mechanical or stiff.`,
      ],
      ['human', `I'm planning to travel, please give me some advice.`],
      ['ai', `Sure, what can I help you with?`],
    ]);
    const pr = ChatPromptTemplate.fromTemplate(prompt);
    const history = ChatPromptTemplate.fromMessages([
      cxt,
      ...his.map<BaseMessagePromptTemplateLike>((h) => [
        h.role === 'ai' ? 'ai' : 'human',
        h.text,
      ]),
      pr,
    ]);

    const chain = history.pipe(gemini.langchain).pipe(gemini.outputParser);
    const response = await chain.invoke({
      career: 'travel consultant',
    });

    return response;
  }
  private async withBare(prompt: string, his: ChatIdModel[]) {
    const cxt: Content[] = [
      {
        role: 'user',
        parts: [
          {
            text: `Act as a travel consultant, please advise me on travel issues.
            Answer the question in a fun way, don't be too mechanical or stiff.`,
          },
        ],
      },
      {
        role: 'model',
        parts: [{ text: 'Sure, what can I help you with?' }],
      },
    ];
    const history: Content[] = [
      ...cxt,
      ...his.map((h) => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.text }],
      })),
    ];
    const result = await gemini.base.startChat({ history }).sendMessage(prompt);
    const textGemini = result.response.text();
    return textGemini;
  }
  //#endregion

  // =====================================================================================
  // =====================================================================================
  // =====================================================================================

  async clearAllChatData() {
    await chatsCollection.clearAllData();
  }

  async deleteMessage(id: string) {
    await chatsCollection.delete(id);
  }

  async addChat(userId: string, role: ChatRole, text: string) {
    const data: ChatModel = {
      userId,
      role,
      text,
      createdAt: Timestamp.fromDate(new Date()),
    };
    const chat = await chatsCollection.add(data);
    return chat;
  }

  async getHistoryChat(userId: string) {
    const chats = await chatsCollection.getBy(
      { userId },
      { orderBy: 'createdAt', direction: 'asc' },
    );

    return chats;
  }

  async promptAi(prompt: string, history: ChatIdModel[]) {
    const response = await this.withLangchain(prompt, history);

    return response || 'error';
  }
}
