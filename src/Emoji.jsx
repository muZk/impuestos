import React from "react";
import Twemoji from "react-twemoji";

export default function Emoji({ value }) {
  return (
    <Twemoji tag="span" options={{ className: "emoji", ext: ".svg", folder: "svg" }}>
      {value}
    </Twemoji>
  );
}