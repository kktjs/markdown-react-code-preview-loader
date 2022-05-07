import { Fragment } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import '@wcj/dark-mode';
import styles from './Layout.module.less';

export function Layout() {
  return (
    <Fragment>
      <header className={styles.header}>
        <nav>
          <NavLink to="/" replace>
            Docuemnt
          </NavLink>
          <NavLink to="/example" replace>
            Example
          </NavLink>
          <dark-mode permanent></dark-mode>
        </nav>
      </header>
      <div className={styles.warpper}>
        <Outlet />
      </div>
    </Fragment>
  );
}
