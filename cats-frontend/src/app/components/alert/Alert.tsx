import React from 'react';
import { ToastOptions, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Alert.css';

interface ErrorMsgProps {
  customMessage?: string;
  customErrorHeading?: string;
  customFooterMessage?: string;
}

const createToastOptions = (type: 'error' | 'success'): ToastOptions => ({
  className: `toast-${type}`,
  type,
  closeButton: false,
  position: 'top-center',
});

const ErrorMsg: React.FC<ErrorMsgProps> = ({
  customMessage,
  customErrorHeading,
  customFooterMessage,
}) => {
  const messages = customMessage
    ? customMessage.split(/\n|\.(?=\s)/).filter((m) => m.trim().length > 0)
    : ['System error prevented changes from saved.'];

  return (
    <div className="custom" role="alert">
      <div className="custom custom-border">
        <span className="error-heading ">
          {' '}
          {customErrorHeading
            ? customErrorHeading
            : 'Changes could not be saved'}{' '}
        </span>
        <div className="error-text">
          {messages.map((msg, index) => (
            <div key={index}>{msg.trim()}</div>
          ))}
        </div>
      </div>
      <span className="error-text">
        {customFooterMessage
          ? customFooterMessage
          : 'Please try again or contact support.'}{' '}
      </span>
    </div>
  );
};

const BasicAlertMsg: React.FC<ErrorMsgProps> = ({ customMessage }) => {
  const messages = customMessage
    ? customMessage.split(/\n|\.(?=\s)/).filter((m) => m.trim().length > 0)
    : ['Error entering input. Please try again.'];

  return (
    <div className="custom" role="alert">
      <div className="error-text">
        {messages.map((msg, index) => (
          <div key={index}>{msg.trim()}</div>
        ))}
      </div>
    </div>
  );
};

interface SuccessMsgProps {
  customMessage?: string;
}

const SuccessMsg: React.FC<SuccessMsgProps> = ({ customMessage }: any) => (
  <div className=" custom" role="alert">
    <div className="custom">
      <span className="error-text">
        {customMessage ? customMessage : 'Changes saved successfully.'}
      </span>
    </div>
  </div>
);

export const notifyError = (
  message?: string,
  headerText?: string,
  footerText?: string,
) => {
  toast(
    <ErrorMsg
      customMessage={message}
      customErrorHeading={headerText}
      customFooterMessage={footerText}
    />,
    createToastOptions('error'),
  );
};

//Basic alert without header and footer
export const notifyAlert = (message?: string) => {
  toast(<BasicAlertMsg customMessage={message} />, createToastOptions('error'));
};

export const notifySuccess = (message?: string) => {
  toast(<SuccessMsg customMessage={message} />, createToastOptions('success'));
};
