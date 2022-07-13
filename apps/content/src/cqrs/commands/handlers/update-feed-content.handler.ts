import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ContentsService } from 'apps/content/contents/contents.service';
import { UpdateFeedContentCommand } from '../impl/update-feed-content.command';

@CommandHandler(UpdateFeedContentCommand)
export class UpdateFeedContentHandler
  implements ICommandHandler<UpdateFeedContentCommand>
{
  constructor(private contentsService: ContentsService) {}

  async execute(command: UpdateFeedContentCommand) {
    const userId = command.userId;

    await this.contentsService.updateContentFeed(userId);
  }
}
