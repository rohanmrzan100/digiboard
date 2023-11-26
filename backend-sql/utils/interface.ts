export interface Device {
  _id: string;
  name: string;
  uid: string;
  owner_id: string;
  interactive?: string;
  c_playlist: string;
  a_playlist: [string];
  change: boolean;
  SFD_playlist: [string];
  SFR_playlist: [string];
  playlistChange: [
    {
      name: string;
      added?: {
        name: string;
        media: string;
      };

      remove?: {
        name: string;
        media: string;
      };
    }
  ];
}
