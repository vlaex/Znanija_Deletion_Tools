import { useState } from "react";
import Moment from "react-moment";
import { toHTML as MarkdownToHTML } from "slack-markdown";
import { Flex, Label, Avatar, Text, Link, Button, Icon } from "brainly-style-guide";

import WithTooltip from "./WithTooltip";
import UserPreview from "./UserPreview";
import DeleteUserTooltip from "./DeleteUserTooltip";
import UserContentPreview from "./UserContentPreview";

import type { Message } from "@typings";

export default function QueueItem(props: {
  item: Message
}) {
  const item = props.item;
  const sentAt = new Date(+item.message.ts / 0.001);

  const [hidden, setHidden] = useState(false);

  const deleteMessage = () => {
    navigator.sendBeacon(`https://helpbot.br-helper.com/delete_user/${item.user.database_id}`);
    setHidden(true);
  };

  return (
    <div className="queue-item" hidden={hidden}>
      <div className="queue-item__data">
        <WithTooltip noMaxWidth direction="to-right" tooltip={<DeleteUserTooltip userId={item.user.database_id} />}>
          <Label className="queue-item__reason-label" color="red">{item.reason}</Label>
        </WithTooltip>
        <Flex alignItems="center" className="queue-item__user-data">
          <WithTooltip direction="to-right" tooltip={<UserPreview userId={item.user.database_id} />}>
            <Avatar size="s" imgSrc={item.user.avatar} />
          </WithTooltip>
          <Flex direction="column" marginLeft="xs">
            <Link href={item.link} target="_blank">{item.user.nick}</Link>
            <Text type="span" className="queue-item__user-status" size="small" color="text-gray-70" weight="bold">
              {item.user.rank}
            </Text>
          </Flex>
        </Flex>
        <Flex alignItems="center" className="queue-item__user-labels">
          <WithTooltip noMaxWidth direction="to-left" tooltip={<UserContentPreview userId={item.user.database_id} />}>
            <Label iconType="answer" color="blue" type="solid">{item.user.answers_count}</Label>
          </WithTooltip>
        </Flex>
        <Flex direction="column" className="queue-item__datetime">
          <Moment locale="ru-RU" date={sentAt.toISOString()} interval={1000} fromNow />
          <Text size="xsmall">{sentAt.toLocaleString("ru-RU")}</Text>
        </Flex>
        <WithTooltip direction="to-left" tooltip={<Flex direction="column">
          <Flex alignItems="center">
            <Avatar size="s" imgSrc={item.sender.avatar} />
            <Flex marginLeft="xs">
              <Text weight="bold">{item.sent_by}</Text>
            </Flex>
          </Flex>
          <Flex direction="column" marginTop="xs">
            <Text size="xsmall" weight="bold" color="text-gray-70">??????????????????</Text>
            <Text size="small" style={{ lineHeight: 1 }} dangerouslySetInnerHTML={{ 
              __html: MarkdownToHTML(item.message.text) 
            }} />
          </Flex>
        </Flex>}>
          <Flex alignItems="center" className="queue-item__slack-user-data">
            <Avatar size="xs" imgSrc={item.sender.avatar} />
            <Text type="span" size="small" color="text-black" weight="bold">{item.sent_by}</Text>
          </Flex>
        </WithTooltip>
        <Button 
          iconOnly 
          size="s" 
          onClick={deleteMessage} 
          title="?????????????? ??????????????????" 
          icon={<Icon type="close" size={16} color="icon-black" />} 
          type="transparent" 
        />
      </div>
    </div>
  );
}