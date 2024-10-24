import styled from "styled-components";

export default function Button({ label, click }: Props) {
  return <ButtonSld onClick={click}>{label}</ButtonSld>;
}

export const ButtonSld = styled.button`
 
  width: 50vw;
  height:4.6vh;
   display: flex;
  padding: 8px 45%;
  margin-right: 10px;
   background-image: linear-gradient(to right, #FF59BD 0%, #F60094 100%);
  color: #fff;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-family: sans-serif; 
  font-size: 15px; 
`;

interface Props {
  label: string;
  click: () => void;
}
