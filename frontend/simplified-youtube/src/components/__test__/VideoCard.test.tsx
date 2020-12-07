import React from 'react';
import ReactDom from 'react-dom';
import VideoCard from '../VideoCard';

import { render } from "@testing-library/react";
import '@testing-library/jest-dom/extend-expect';

const video: any = {"description":"Test description","duration":10.01,"filePath":"uploads/videos/2020/11/Main_build.mp4","id":"Lv6CtbSE55rzwsw_7DMqUizfJNEmKfeO1milh9ba","mimeType":"video/mp4","name":"Test","size":15260430,"thumbnailPath":"uploads/thumbnails/2020/11/1607274443447.png"};

it("Renders without crashing", () =>{
    const div = document.createElement("div");
    ReactDom.render(<VideoCard video={video} />,div);
});

it('Renders data inside card correct', () => {
  const {getByTestId} = render(<VideoCard video={video} />)
  expect(getByTestId('title')).toHaveTextContent('Test');
  expect(getByTestId('description')).toHaveTextContent('Test description');
  expect(getByTestId('playbtn')).toHaveTextContent('Play Video');
});