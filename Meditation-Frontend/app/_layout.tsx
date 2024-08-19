import store from "./(redux)/store";
import { Provider } from "react-redux";
import Structure from "./Structure";



export default function RootLayout() {

  return (
    <Provider store={store}>
      <Structure />
    </Provider>
  );
}
