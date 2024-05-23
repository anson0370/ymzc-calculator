'use client';

import { useState, ReactNode, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './shadcn/ui/alert-dialog';
import { Button } from './shadcn/ui/button';

type CallbackMethod = () => (() => void) | void | Promise<void> | Promise<() => void>;

type ConfirmPropsType = {
  title?: string | ReactNode,
  body: string | ReactNode,
  icon?: string | ReactNode,
  danger?: boolean,
  confirmText?: React.ReactNode,
  cancelText?: React.ReactNode,
  onConfirm?: CallbackMethod,
  onCancel?: CallbackMethod,
  noCancel?: boolean,
  children?: ReactNode,
  defaultOpen?: boolean,
}

type UseConfirmPropsType = Omit<ConfirmPropsType, 'children' | 'defaultOpen'>

type ConfirmsStateType = {
  confirms: Array<{ id: string } & ConfirmPropsType>,
}

function Confirm({
  title,
  body,
  danger = false,
  confirmText = 'Continue',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  noCancel,
  children,
  defaultOpen = false,
}: ConfirmPropsType) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const onClose = async () => {
    let callback: void | (() => void) = undefined;
    if (onCancel != null) {
      callback = await onCancel();
    }
    setIsOpen(false);
    if (callback != null) {
      callback();
    }
  };

  const onProcess = async () => {
    const callback = await onConfirm?.();
    setIsOpen(false);
    if (callback != null) {
      callback();
    }
  };

  return (
    <AlertDialog open={isOpen}>
      {
        children != null ? (
          <AlertDialogTrigger
            asChild
            onClick={(e) => {
              setIsOpen(true);
              e.preventDefault();
            }}
          >
            {children}
          </AlertDialogTrigger>
        ) : null
      }
      <AlertDialogContent onEscapeKeyDown={onClose}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title || 'Are you sure?'}</AlertDialogTitle>
          <AlertDialogDescription>{body}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {!noCancel && (
            <AlertDialogCancel onClick={onClose}>{cancelText}</AlertDialogCancel>
          )}
          {/* 如果这里用 AlertDialogAction 则内部 Button 的 variant 设置不会生效，所以直接用 Button */}
          <Button
            onClick={onProcess}
            variant={danger ? 'destructive' : 'default'}
          >
            {confirmText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

let memoryState: ConfirmsStateType = { confirms: [] };

const confirmListeners: Array<(state: ConfirmsStateType) => void> = [];

function confirm(props: UseConfirmPropsType) {
  const id = Date.now().toString();
  const onConfirm = async () => {
    await props.onConfirm?.();
    return () => {
      setTimeout(() => removeConfirm(id), 500);
    };
  };
  const onCancel = async () => {
    if (props.onCancel != null) {
      await props.onCancel();
    }
    return () => {
      setTimeout(() => removeConfirm(id), 500);
    };
  };
  const confirmProps: { id: string } & ConfirmPropsType = { ...props, id, onConfirm, onCancel, defaultOpen: true };
  memoryState = { confirms: [...memoryState.confirms, confirmProps] };
  confirmListeners.forEach((listener) => {
    listener(memoryState);
  });
  return id;
}

function removeConfirm(id: string) {
  memoryState = { confirms: memoryState.confirms.filter((confirm) => confirm.id !== id) };
  confirmListeners.forEach((listener) => {
    listener(memoryState);
  });
}

function useConfirm() {
  const [confirms, setConfirms] = useState<ConfirmsStateType>({ confirms: [] });

  useEffect(() => {
    confirmListeners.push(setConfirms);
    return () => {
      confirmListeners.splice(confirmListeners.indexOf(setConfirms), 1);
    };
  }, [confirms]);

  return {
    confirms: confirms.confirms,
    confirm,
    remove: removeConfirm,
  };
}

function ConfirmHolder() {
  const { confirms } = useConfirm();

  return (
    <>
      {
        confirms.map((confirm) => {
          return (
            <Confirm key={confirm.id} {...confirm} />
          );
        })
      }
    </>
  );
}

export { Confirm, ConfirmHolder, useConfirm };
