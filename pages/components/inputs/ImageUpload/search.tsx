import type { FC, MouseEventHandler } from 'react';
import { createRef, useCallback, useContext } from 'react';
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
      <label>Image URL</label>
      <input type={'url'} ref={input} />
      <button type={'button'} onClick={(event) => props.changed?.(input.current!.value)}>
        Search
      </button>
      <button type={'submit'} onClick={handleSeachClose}>
        Close
      </button>
    </>
  );
};

export default Search;
