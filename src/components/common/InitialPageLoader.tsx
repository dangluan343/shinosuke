"use client";

import React, { useState, useEffect } from "react";
import BuriBuriLoader from "./BuriBuriLoader";

export function InitialPageLoader() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Chỉ kích hoạt một lần khi trang bắt đầu tải
    setShow(true);
  }, []);

  if (!show) return null;

  return (
    <BuriBuriLoader
      fullScreen={true}
      autoDismissMs={1600}
      onDismiss={() => setShow(false)}
      text="Buri Buri! Đang nạp bánh Chocobi..."
    />
  );
}

export default InitialPageLoader;
