import { createBrowserRouter } from "react-router-dom";

// Importações dos componentes de página
import App from "../App";
import CriarConta from "../components/CriarConta";
import CriarContaSteps from "../components/CriarContaSteps";
import Login from "../components/Login";
import DonationSteps from "../components/DonationSteps";
import MyDonations from "../components/MyDonations";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <CriarConta />,
  },
  {
    path: "/criar-conta",
    element: <CriarConta />,
  },
  {
    path: "/criar-conta/passo-a-passo",
    element: <CriarContaSteps />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/doar",
    element: <DonationSteps />,
  },
  {
    path: "/suas-doacoes",
    element: <MyDonations />,
  },
]);
