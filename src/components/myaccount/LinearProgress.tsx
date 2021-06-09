import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import {
  toolbelt as T
} from '../../util/@jacob/core';

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
});
// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace LinearBuffer {
  export interface Props {
    onProgressComplete: T.Thunk<any>;
  }
}
export default function LinearBuffer(props: LinearBuffer.Props) {
  const classes = useStyles();
  const [progress, setProgress] = React.useState(0);
  const [buffer, setBuffer] = React.useState(10);

  const progressRef = React.useRef(() => {});
  React.useEffect(() => {
    progressRef.current = () => {
      if (progress > 100) {
        /*
        setProgress(0);
        setBuffer(10);
        */
        props.onProgressComplete();
      } else {
        const diff = Math.random() * 30;
        const diff2 = Math.random() * 30;
        setProgress(progress + diff);
        setBuffer(progress + diff + diff2);
      }
    };
  });

  React.useEffect(() => {
    const timer = setInterval(() => {
      progressRef.current();
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className={classes.root}>
      <LinearProgress variant="buffer" value={progress} valueBuffer={buffer} />
    </div>
  );
}