import { useState } from "react";

export const useFile = () => {
  const [file, setFile] = useState<File>();

  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  return { file, onChangeFile };
};
