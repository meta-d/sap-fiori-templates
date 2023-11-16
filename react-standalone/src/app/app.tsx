// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.less';
import { RouterProvider, createBrowserRouter, redirect } from 'react-router-dom';
import NxWelcome from './nx-welcome';

const router = createBrowserRouter([
  {
    path: "/",
    element: redirect("/welcome") as unknown as React.ReactNode,
  },
  {
    path: "/welcome",
    element: <NxWelcome />,
  }
]);


export function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
