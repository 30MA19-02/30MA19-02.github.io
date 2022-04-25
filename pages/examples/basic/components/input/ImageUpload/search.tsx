import type { FC, MouseEventHandler } from 'react';
import { createRef, useCallback, useContext } from 'react';
import { Button, Field } from 'theme-ui';
import { OptionsContext } from '.';

interface property {
  changed?: (value: string) => void;
}
const Search: FC<property> = (props) => {
  const { setMainState } = useContext(OptionsContext)!;
  const handleSeachClose: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      setMainState('initial');
    },
    [setMainState],
  );
  const input = createRef<HTMLInputElement>();
  return (
    <>
      <Field type={'url'} label={'Image URL'} ref={input} />
      <Button type="button" onClick={(event) => props.changed?.(input.current!.value)}>
        Search
      </Button>
      <Button type="button" onClick={handleSeachClose}>
        Close
      </Button>
    </>
  );
};

export default Search;
