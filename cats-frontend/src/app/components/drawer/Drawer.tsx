import { Drawer as MUIDrawer, SxProps, Theme } from '@mui/material';

import { FC, ReactNode, useCallback, useEffect, useRef, useState } from 'react';

import './Drawer.css';
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  XmarkIcon2,
} from '../common/icon';

enum ExpansionState {
  Default,
  Expanded,
  Hidden,
}

const getExpandIcon = (state: ExpansionState) => {
  switch (state) {
    case ExpansionState.Expanded:
      return <ChevronDown />;
    case ExpansionState.Hidden:
      return <ChevronUp />;
    case ExpansionState.Default:
      return <ChevronRight />;
    default:
      return <ChevronRight />;
  }
};

const getNextExpansionStateFromCurrentState = (
  currentState: ExpansionState,
) => {
  switch (currentState) {
    case ExpansionState.Expanded:
      return ExpansionState.Default;
    case ExpansionState.Hidden:
      return ExpansionState.Default;
    case ExpansionState.Default:
      return ExpansionState.Expanded;
    default:
      return ExpansionState.Default;
  }
};

const getNextExpansionStateFromResizeRatio = (ratio: number) => {
  switch (true) {
    case ratio <= 60 && ratio > 30:
      return ExpansionState.Default;
    case ratio > 60:
      return ExpansionState.Expanded;
    default:
      return ExpansionState.Hidden;
  }
};

interface DrawerProps {
  children: ReactNode;
  isOpen: boolean;
  onClose?: () => void;
  title?: string | ReactNode;
}

export const Drawer: FC<DrawerProps> = ({
  children,
  isOpen,
  onClose,
  title,
}) => {
  const [open, setOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [expansion, setExpansion] = useState<ExpansionState>(
    ExpansionState.Default,
  );

  useEffect(() => {
    if (isOpen) {
      setOpen(true);
      setIsVisible(true);
    }
  }, [isOpen]);

  const [drawerResizeHeight, setDrawerResizeHeight] = useState<number | null>(
    null,
  );
  const drawerHeightRef = useRef(drawerResizeHeight);
  drawerHeightRef.current = drawerResizeHeight;

  const enterResizeMode = () => {
    document.addEventListener('mouseup', exitResizeMode, true);
    document.addEventListener('mousemove', resizeDrawer, true);
  };

  const handleDrawerClose = () => {
    if (onClose) onClose();

    setOpen(false);
    setExpansion(ExpansionState.Default);

    // Listen for the transition end to set visibility
    // Visibility change has to happen once the translateY() off screen has completed
    const drawerElement = document.querySelector('.drawer-container');
    const onTransitionEnd = () => {
      setIsVisible(false);
      drawerElement?.removeEventListener('transitionend', onTransitionEnd);
    };
    drawerElement?.addEventListener('transitionend', onTransitionEnd);
  };

  const exitResizeMode = () => {
    document.removeEventListener('mouseup', exitResizeMode, true);
    document.removeEventListener('mousemove', resizeDrawer, true);
    setDrawerResizeHeight(null);

    if (!drawerHeightRef.current) {
      return;
    }

    const drawerHeightRatio =
      (drawerHeightRef.current / document.body.clientHeight) * 100;

    setExpansion(getNextExpansionStateFromResizeRatio(drawerHeightRatio));
  };

  const resizeDrawer = useCallback((e: MouseEvent) => {
    const newHeight = document.body.offsetHeight - e.clientY;
    setDrawerResizeHeight(newHeight);
  }, []);

  const buildDrawerStyles = () => {
    let styles: SxProps<Theme> = {};

    if (expansion === ExpansionState.Default) {
      styles = {
        ...styles,
        height: `50%`,
        maxHeight: '480px',
      };
    }
    if (expansion === ExpansionState.Expanded) {
      styles = {
        ...styles,
        height: '100%',
        maxHeight: '100%',
      };
    }
    if (expansion === ExpansionState.Hidden) {
      styles = {
        ...styles,
        height: '70px',
        maxHeight: '70px',
        overflowY: 'hidden',
      };
    }
    if (drawerResizeHeight !== null) {
      styles = {
        ...styles,
        height: `${drawerResizeHeight}px`,
        maxHeight: '100%',
        transition: '0s !important',
      };
    }
    if (!open) {
      styles = {
        ...styles,
        transform: `translateY(${Math.floor(document.body.clientHeight / 2)}px)`,
        height: `50%`,
        maxHeight: '480px',
        visibility: isVisible ? 'visible' : 'hidden',
      };
    }

    return styles;
  };

  return (
    <MUIDrawer
      open
      anchor="bottom"
      variant="persistent"
      aria-hidden={!open}
      className="drawer-container"
      PaperProps={{
        sx: buildDrawerStyles(),
      }}
    >
      <div className="drawer-header">
        <div className="resize-handle" onMouseDown={enterResizeMode}></div>

        <button
          className="border-0 bg-transparent"
          onClick={() => {
            setExpansion(getNextExpansionStateFromCurrentState(expansion));
          }}
        >
          {getExpandIcon(expansion)}
        </button>
        <span>{title}</span>
        <button className="border-0 bg-transparent" onClick={handleDrawerClose}>
          <XmarkIcon2 size={20} />
        </button>
      </div>

      <div className="drawer-body">{children}</div>
    </MUIDrawer>
  );
};
