import styled from "styled-components/native";
export const MinesweeperView = styled.View`
  padding: 20px;
`;
export const MinesweeperGameBoard = styled.View``;
export const MineRow = styled.View`
  flex-direction: row;
  justify-content: space-evenly;
`;
export const Mine = styled.Text`
  flex: 100%;
  border-color: #0004;
  border-right-width: 1px;
  border-bottom-width: 1px;
  border-top-width: ${(props) => (props?.borderTop && "1px") || "0px"};
  border-left-width: ${(props) => (props?.borderLeft && "1px") || "0px"};
  /* padding: 0px; */
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: ${(props) => {
    if (props.flagged) return "#0000ff";
    if (props?.exposed) {
      return props?.hasMine
        ? "#ff0000"
        : (props?.hasData && "#8885") || "#8882";
    }
    return "#fff";
  }};
  font-size: 16px;
`;
export const MineFieldImage = styled.Image`
  width: 50px;
  height: 50px;
`;
export const MinesweeperHeader = styled.View`
  padding: 20px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
export const MinesweeperHeaderText = styled.Text`
  font-size: ${(props) => (props.size && `${props.size}px`) || "12px"};
  text-align: center;
  color: ${(props) => props?.color || "#000"};
  background-color: ${(props) => props?.bgColor || "#fff"};
  padding: ${(props) => props?.padding || "0px"};
  border-radius: 5px;
`;

export const MinesweeperHeaderText_ = styled.Text`
  margin: 10px auto;
  background-color: #00ffff;
  color: #000;
  padding: 10px 20px;
  border-radius: 5px;
`;
