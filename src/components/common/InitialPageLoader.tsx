"use client";

import React, { useState, useEffect } from "react";
import BuriBuriLoader from "./BuriBuriLoader";

export function InitialPageLoader() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Kích hoạt khi trang bắt đầu tải
    setShow(true);
  }, []);

  if (!show) return null;

  return (
    <BuriBuriLoader
      fullScreen={true}
      autoDismissMs={3800}
      onDismiss={() => setShow(false)}
    />
  );
}

export default InitialPageLoader;
