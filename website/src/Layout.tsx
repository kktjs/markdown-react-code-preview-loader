import { Fragment } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import GitHubCorners from '@uiw/react-github-corners';
import '@wcj/dark-mode';
import styles from './Layout.module.less';
import Language from './language/Select';
import { useTranslation } from 'react-i18next';

export function Layout() {
  const i18next = useTranslation();
  return (
    <Fragment>
      <GitHubCorners target="__blank" fixed href="https://github.com/kktjs/markdown-react-code-preview-loader" />
      <header className={styles.header}>
        <nav>
          <NavLink to="/" replace>
            {i18next.t('docuemnt')}
          </NavLink>
          <NavLink to="/example" replace>
            {i18next.t('example')}
          </NavLink>
          <dark-mode permanent></dark-mode>
          <Language />
        </nav>
      </header>
      <div className={styles.warpper}>
        <Outlet />
      </div>
    </Fragment>
  );
}
