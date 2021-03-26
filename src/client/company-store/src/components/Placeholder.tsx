import { DefaultPalette, FontIcon, IStackStyles, IStackTokens, Label, mergeStyles, Stack } from '@fluentui/react';
import * as React from 'react';

export interface IPlaceholderProps {
  text: string;
  icon: string;
}
export const Placeholder: React.FunctionComponent<IPlaceholderProps> = (props: IPlaceholderProps) => {
  const iconClass = mergeStyles({
    fontSize: 100,
    color: DefaultPalette.neutralTertiaryAlt,
  });

  const textClass = mergeStyles({
    fontSize: 20,
    color: DefaultPalette.neutralTertiaryAlt,
  });

  const stackStyles: IStackStyles = {
    root: {},
  };
  const itemStyles: React.CSSProperties = {
    alignItems: 'center',
    justifyContent: 'center',
  };
  const stackTokens: IStackTokens = { childrenGap: 5 };
  return (
    <div id="outer">
      <div id="table-container">
        <div id="table-cell">
          <Stack tokens={stackTokens}>
            <Stack horizontalAlign="center" styles={stackStyles}>
              <FontIcon iconName={props.icon} className={iconClass} style={itemStyles} />
              <Label className={textClass}>{props.text}</Label>
            </Stack>
          </Stack>
        </div>
      </div>
    </div>
  );
};
