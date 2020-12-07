import React from 'react';
import ReactDom from 'react-dom';
import Upload from '../Upload';

import { render, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom/extend-expect';


it("Renders without crashing", () =>{
    const div = document.createElement("div");
    ReactDom.render(<Upload />,div);
});


it('Test Upload Form without file upload', () => {
  const { getByTestId } = render(<Upload />);
  const input = getByTestId("title");
  fireEvent.change(input, { target: { value: "Title" } });
  expect(input).toHaveValue("Title");
  const desc = getByTestId("description");
  fireEvent.change(desc, { target: { value: "Description" } });
  expect(desc).toHaveValue("Description");
});