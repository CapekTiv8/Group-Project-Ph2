import { Outlet } from 'react-router';
import { useDarkMode } from '../context/Darkmode';

export default function BaseLayout() {
  const {isDark, toggleTheme} = useDarkMode();
  return (
    <>
    <button onClick={toggleTheme}>{isDark ? "Light" : "Dark"}</button>
      <Outlet />
      {/* <Header/> */}
    </>
  );
}
