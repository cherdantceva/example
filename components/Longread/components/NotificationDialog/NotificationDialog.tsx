import React from 'react'
import { CloseCircleOutlined } from '@ant-design/icons'
import { Button, Modal, Result, Typography } from 'antd'
import css from './styles.module.sass'

const { Paragraph, Text } = Typography

export interface Notification {
  status: 'error' | 'success' | 'info'
  title: string
  messages: string[] | null
  output?: string
  button: {
    title: string
    onClick?: () => void
  }
}

interface NotificationProps {
  readonly notification: Notification | null
  readonly onOk: () => void
  readonly onCancel?: () => void
}

const NotificationDialog: React.FC<NotificationProps> = ({ notification, onOk, onCancel }) =>
  notification && (
    <Modal
      width={800}
      closable
      open
      footer={[
        <Button key='primary' type='primary' onClick={notification.button?.onClick || onOk}>
          {notification.button.title}
        </Button>,
      ]}
      onCancel={onCancel}
    >
      <Result status={notification.status} title={notification.title}>
        {notification.messages && (
          <div>
            <Paragraph>
              <Text
                strong
                style={{
                  fontSize: 16,
                }}
              >
                В описании лонгрида есть следующие ошибки:
              </Text>
            </Paragraph>
            {notification.messages.map((value) => (
              <Paragraph key={value}>
                <CloseCircleOutlined className={css.errorIcon} /> {value}
              </Paragraph>
            ))}
          </div>
        )}
        {notification.output && <div className={css.output}>{notification.output}</div>}
      </Result>
    </Modal>
  )

export default NotificationDialog
