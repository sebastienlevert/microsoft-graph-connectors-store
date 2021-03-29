import * as React from 'react';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { useBoolean } from '@uifabric/react-hooks';
import {
  ComboBox,
  Dialog,
  DialogFooter,
  DialogType,
  IComboBox,
  IComboBoxOption,
  MessageBar,
  MessageBarType,
  ProgressIndicator,
} from '@fluentui/react';
import { useRecoilValue } from 'recoil';
import { getCatalogItem } from '../state/itemState';
import { addTodoItem, getTaskLists } from '../services/TasksService';
import { Loading } from './Loading';

export interface ITodotemDialogProps {
  onDismiss(): void;
}

export const TodoItemDialog: React.FunctionComponent<ITodotemDialogProps> = (props: ITodotemDialogProps) => {
  const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(false);
  const item = useRecoilValue(getCatalogItem);
  const [taskListsOptions, setTaskListsOptions] = React.useState<IComboBoxOption[]>([]);
  const [taskListId, setTaskListId] = React.useState<string | number | undefined>('');
  const [success, setSuccess] = React.useState<boolean>(false);
  const [inProgress, setInProgress] = React.useState<boolean>(false);
  const [formDisabled, setFormDisabled] = React.useState<boolean>(true);

  const onAdd = async function () {
    setInProgress(true);
    setFormDisabled(true);
    await addTodoItem(item, taskListId?.toString());
    setInProgress(false);
    setSuccess(true);
    setTimeout(() => {
      setFormDisabled(false);
      onDismiss();
    }, 2000);
  };

  const onDismiss = function () {
    toggleHideDialog();
    props.onDismiss();
  };

  const dialogContentProps = {
    type: DialogType.normal,
    title: `Add ${item?.title} to Todo?`,
    closeButtonAriaLabel: 'Close',
  };

  const modalProps = React.useMemo(
    () => ({
      isBlocking: true,
    }),
    []
  );

  const onTaskListChange = React.useCallback(
    (ev: React.FormEvent<IComboBox>, option?: IComboBoxOption): void => {
      setTaskListId(option?.key.toString());
    },
    [setTaskListId]
  );

  React.useEffect(() => {
    getTaskLists().then((taskLists) => {
      let options: IComboBoxOption[] = [];
      taskLists.forEach((list) => {
        options.push({
          key: list.id!,
          text: list.displayName!,
        });
      });

      setTaskListsOptions(options);
      setFormDisabled(false);
    });
  }, []);

  return (
    <>
      <Dialog
        hidden={hideDialog}
        onDismiss={onDismiss}
        dialogContentProps={dialogContentProps}
        modalProps={{ isBlocking: true }}
      >
        <ComboBox
          label="List"
          placeholder="Select a list"
          autoComplete="on"
          options={taskListsOptions}
          onChange={onTaskListChange}
        />
        <div style={{ paddingTop: '1em' }}>
          {success && (
            <MessageBar messageBarType={MessageBarType.success}>The task {item.title} was added to To Do</MessageBar>
          )}
          {inProgress && <ProgressIndicator description={`Adding the task ${item.title}...`} />}
        </div>
        <DialogFooter>
          <PrimaryButton onClick={onAdd} text="Add" disabled={!taskListId || formDisabled} />
          <DefaultButton onClick={onDismiss} text="Cancel" disabled={formDisabled} />
        </DialogFooter>
      </Dialog>
    </>
  );
};
