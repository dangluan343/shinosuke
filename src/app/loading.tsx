import React from "react";
import BuriBuriLoader from "@/components/common/BuriBuriLoader";

export default function Loading() {
  return (
    <BuriBuriLoader
      fullScreen={true}
      text="Buri Buri! Đang chuyển trang..."
    />
  );
}

