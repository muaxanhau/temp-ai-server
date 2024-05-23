import { IsNotEmpty, IsString } from 'class-validator';
import { ChatIdModel } from 'src/models';

//=====================================================================================================================
// chat
export class ChatBodyModel {
  @IsNotEmpty()
  @IsString()
  prompt: string;
}
export type ChatResponseModel = ChatIdModel;

//=====================================================================================================================
// deleteMessage
export class DeleteMessageByIdParamModel {
  @IsNotEmpty()
  @IsString()
  id: string;
}
