import app from './app';
import request from 'supertest';

describe('should get all videos', () => {
   it("returns all the videos", async() =>{
      const res = await request(app).get("/allVideos");
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Success");
      expect(res.body.data).toBeDefined();
   })
});