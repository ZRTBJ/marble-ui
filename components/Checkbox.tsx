import styled from 'styled-components'

const Checkbox = styled.input.attrs({ type: 'checkbox' })<{ size?: String }>`
  appearance: none;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  display: inline-block;
  height: ${({ size }) => size || '30px'};
  width: ${({ size }) => size || '30px'};
  vertical-align: middle;
  transition: background-color 0.2s ease-in-out;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  box-shadow: 0px 4px 40px rgba(42, 47, 50, 0.09), inset 0px 7px 24px #6d6d78;

  &:after {
    content: '';
    position: absolute;
    border-bottom: 2px solid;
    border-left: 2px solid;
    border-color: transparent;
    top: 30%;
    left: 0;
    right: 0;
    width: 50%;
    height: 25%;
    margin: auto;
    transform: rotate(-50deg);
    transition: border-color 0.2s ease-in-out;
  }

  &:checked {
    &:after {
      border-color: white;
    }
  }

  &:disabled {
    cursor: default;
    opacity: 0.6;
  }
`

export default Checkbox
