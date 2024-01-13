// 逻辑部分待补充
import { toggle } from '../../logic/toggleAppearance';
import Styles from './index.module.scss';

interface SwitchProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function Switch(props: SwitchProps) {
  return (
    <button
      className={`${Styles.switch} ${props.className}`}
      id={props.id ?? ''}
      type="button"
      role="switch"
      {...(props.onClick ? { onClick: props.onClick } : {})}
    >
      <span className={Styles.check}>
        <span className={Styles.icon}>{props.children}</span>
      </span>
    </button>
  );
}

export function SwitchAppearance() {
  return (
    <Switch onClick={toggle}>
      <div className={Styles.sun}>
        <div className="i-carbon-sun" w="full" h="full"></div>
      </div>
      <div className={Styles.moon}>
        <div className="i-carbon-moon" w="full" h="full"></div>
      </div>
    </Switch>
  );
}
