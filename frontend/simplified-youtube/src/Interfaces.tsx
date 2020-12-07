// All the interfaces in one place
export interface IVideo{
    name: string;
    duration: string;
    size: string;
    filePath: string;
    mimeType: string;
    thumbnailPath: string;
    id: string;
    description: string;
    videoURL: string;
}
export interface IVideos{
    allVideos: { [key: string]: IVideo  }
}

export interface IAction{
    type: string,
    payload: any
}