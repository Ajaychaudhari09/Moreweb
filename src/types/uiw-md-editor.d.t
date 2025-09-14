declare module "@uiw/react-md-editor" {
  import * as React from "react";
  
  export interface MDEditorProps {
    value?: string;
    onChange?: (value?: string) => void;
    height?: number;
    preview?: 'live' | 'edit' | 'preview';
    hideToolbar?: boolean;
    visibleDragBar?: boolean;
  }
  
  export default function MDEditor(props: MDEditorProps): JSX.Element;
}
