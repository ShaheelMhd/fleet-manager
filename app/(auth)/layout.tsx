import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function AuthLayout({ children }: Props) {
  return (
    <div className="-m-5 sm:px-3 md:px-7 p-10 h-dvh flex justify-center">
      {children}
    </div>
  );
}
