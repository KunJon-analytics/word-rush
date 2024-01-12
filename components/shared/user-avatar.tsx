"use client";
import Avatar from "boring-avatars";
import React from "react";

interface Props {
  uuid: string;
  size: number;
}

const AvatarIcon = ({ uuid, size }: Props) => {
  return (
    <Avatar
      size={size}
      name={uuid}
      variant="ring"
      colors={["#00040f", "#ff57d8", "#00f6ff", "#BD0090", "#5f5af6"]}
    />
  );
};

export default AvatarIcon;
