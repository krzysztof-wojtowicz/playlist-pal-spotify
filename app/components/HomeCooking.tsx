"use client";

// react imports
import { useState, useEffect } from "react";

// gsap
import gsap from "gsap";

// context
import { useAuthContext } from "../hooks/useAuthContext";

type Props = {
  userList: any[];
  handleFormWindow: Function;
  handlePlaylistData: Function;
};

type UserInfo = {
  country: string;
  display_name: string;
  id: string;
  image: string;
};

type PlaylistInfo = {
  name: string;
  description: string | null;
  id: string;
  url: string;
};

export default function HomeCooking({
  userList,
  handleFormWindow,
  handlePlaylistData,
}: Props) {
  const [cookingState, setCookingState] = useState<string>(
    "getting to know you better..."
  );
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [recList, setRecList] = useState<any[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | undefined>(undefined);
  const [playlistInfo, setPlaylistInfo] = useState<PlaylistInfo | undefined>(
    undefined
  );
  const [snapshot, setSnapshot] = useState<string | undefined>(undefined);

  const { state } = useAuthContext();
  const { accessToken } = state;

  function getValuesForKey(arr: any[], key: string) {
    let temp = arr.map((obj) => obj[key]);

    let artistString: string = "";

    for (let artist of temp) {
      artistString += artist + ",";
    }

    return artistString.slice(0, -1);
  }

  // fetching user data
  useEffect(() => {
    const getUserInfo = async () => {
      setIsLoading(true);

      const json = await fetch(`https://api.spotify.com/v1/me`, {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const response = await json.json();

      if (response.error) {
        console.log("an error occurred: " + response.error);
        setError("an error occurred while getting info about you :(");
      } else {
        let userImage =
          response.images.length > 0 ? response.images[0].url : "";
        setUserInfo({
          country: response.country,
          display_name: response.display_name,
          id: response.id,
          image: userImage,
        });
      }

      setIsLoading(false);
    };

    if (userList.length > 0 && !isLoading && !userInfo) {
      getUserInfo();
    } else {
      setError("your choices are missing, go back!");
    }
  }, []);

  // get recomendations
  useEffect(() => {
    const getRecomendations = async () => {
      setIsLoading(true);

      setCookingState("getting your recommendations...");

      let market = userInfo?.country;

      // ------------------- DEPRECATED ------------------------
      // we used to use get recommendations endpoint but now it is deprecated
      // so this way is no longer working, instead we have to use search endpoint with offset to get later results
      // it is not as good as the recommendations delivered better results than this method

      // let artistIDs = "";
      // let trackIDs = "";
      // for (const element of userList) {
      //   if (element.type === "track") {
      //     trackIDs += element.id + ",";
      //   } else if (element.type === "artist") {
      //     artistIDs += element.id + ",";
      //   }
      // }
      // trackIDs.slice(0, -1);
      // artistIDs.slice(0, -1);

      // const json = await fetch(
      //   `https://api.spotify.com/v1/recommendations?limit=30&seed_artists=${artistIDs}&seed_tracks=${trackIDs}&market=${market}`,
      //   {
      //     method: "GET",
      //     headers: { Authorization: `Bearer ${accessToken}` },
      //   }
      // );

      // ---------------------------------------------------------------

      let trackNames = "";
      let artistNames = "";
      for (const element of userList) {
        if (element.type === "track") {
          trackNames += element.name + " ";
        } else if (element.type === "artist") {
          artistNames += element.name + " ";
        }
      }

      const json = await fetch(
        `https://api.spotify.com/v1/search?limit=30&offset=10&market=${market}&type=track&q=${
          trackNames + artistNames
        }`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      // ---------------------------------------------------------------

      const response = await json.json();

      if (response.error) {
        console.log("An error occurred: " + response.error);
        setError("An error occurred. Please try again later. :((");
      } else {
        let tempList = [];

        for (const track of response.tracks.items) {
          let id = track.id;
          let artists = getValuesForKey(track.artists, "name");
          let uri = track.uri;
          let name = track.name;
          let type = track.type;
          let image =
            track.album.images.length > 0 ? track.album.images[0].url : null;
          let url = track.external_urls.spotify;

          tempList.push({
            name,
            artists,
            uri,
            id,
            type,
            image,
            url,
          });

          setRecList(tempList);
        }
      }

      setIsLoading(false);
    };

    if (userList.length > 0 && userInfo && !isLoading && recList.length === 0) {
      getRecomendations();
    }
  }, [userInfo]);

  // create playlist
  useEffect(() => {
    const createPlaylist = async () => {
      setIsLoading(true);
      setCookingState("creating your playlist...");

      let userId = userInfo?.id;

      let description =
        "This is new, personalized playlist made for you, sit down and explore new songs. Based on:  ";

      for (const element of userList) {
        description += element.name + " ";
      }

      const json = await fetch(
        `https://api.spotify.com/v1/users/${userId}/playlists`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: "Your personalized playlist - by PlaylistPal",
            description: description,
          }),
        }
      );

      const response = await json.json();

      if (response.error) {
        console.log("an error occurred: " + response.error);
        setError("an error occurred while creating your playlist :(");
      } else {
        setPlaylistInfo({
          name: response.name,
          description: response.description,
          id: response.id,
          url: response.external_urls.spotify,
        });
      }

      setIsLoading(false);
    };

    if (userInfo && recList.length > 0 && !isLoading && !playlistInfo) {
      createPlaylist();
    }
  }, [recList]);

  // adding tracks to playlist
  useEffect(() => {
    const addTracks = async () => {
      setIsLoading(true);
      setCookingState("adding fresh tracks to your playlist...");

      let playlistId = playlistInfo?.id;

      let uris: string[] = [];

      for (const element of recList) {
        uris.push(element.uri);
      }

      const json = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uris: uris,
          }),
        }
      );

      const response = await json.json();

      if (response.error) {
        console.log("an error occurred: " + response.error);
        setError("an error occurred while creating your playlist :(");
      } else {
        setSnapshot(response.snapshot_id);

        handlePlaylistData({ userInfo, playlistInfo, trackList: recList });
      }
      setIsLoading(false);
    };

    if (
      playlistInfo &&
      userInfo &&
      recList.length > 0 &&
      !isLoading &&
      !snapshot
    ) {
      addTracks();
    }
  }, [playlistInfo]);

  // setting cover image
  useEffect(() => {
    const uploadImage = async () => {
      setIsLoading(true);

      let base64String =
        "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JicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD5oooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiir9ho+o6g2LOznm/wB1Dik2luTKcYK8nZFCiuxsvh5rVwAZlht1P998kfgK2rb4YHj7VqQHr5Uef51k69NdThqZrhKe818tfyPNKK9aj+Gemj795dN9AoqZfhvowHzS3hP++B/So+tUzmee4RdX9x4/RXsLfDfRiPllvAfXzAf6VBJ8M9MbOy8uk+oU0fWqYLPsI+r+48lor0y5+GHB+y6kM9vMjx/KsW9+HetQZMIguFH9x8H8jVqvTfU6KebYSptNfPT8zjaK0L/RdS084vLKeL3ZDj86z61TT2O+M4zV4u6CiiimUFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUVNaWs95OsFrE8srcBUGSa9F8OfDnhZtckI7i3jP8z/hWc6saa945MVjaOFV6r+XU8+sLC71CYRWVvJPIeyLmu40b4a3UoV9VuVt1/55x/M359K9LsLG10+AQ2UEcEQ7IMZ+vrVmuKeLk/h0PmcVn9appRXKvvZg6V4T0bTQDDZpJIP45vnP+FbqgIoVAFUdABgClormlJy1bPEqVqlV81STb8wooopGYUUUUAFFFFABRRRQAjAMpVgCp6g8g1iap4V0bUgTPZIkh/ji+Q/pxW5RTUnHVM0p1Z0nzU20/I8t1n4azxhpNJuVmHXy5flb8D0rhtR06802YxX1vJA/o64zX0XUF7aW99AYbyCOaI/wuM//AKq6YYuS+LU9rC5/Wp6VlzL7mfOFFeneI/hyrbptDk2t1MEp4/A/415ze2dxY3DQXcLwyr1Vxg1206sanwn0+Fx1HFq9J69upXooorQ6wooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACuk8K+E73XpA4BgswfmmYdfZR3NbngnwO14I77WUZLb70cB4MnufQV6nFGkUaxxIqRqMKqjAArkrYnl92G589mWdKjelh9Zd+i/zZnaFoVholv5djCAxGGlbl2+prUoorz223dnyc6kqknKbu2FFFFBAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFZut6LY61beTfwh8fdccMn0NaVFCbTuioTlTkpQdmjxDxX4QvNCYyrm4sSeJVHK+zDtXMV9KOiyIySKGRhgqwyCK8w8b+BTAJL/RULRfektxyV919R7V30cTze7M+sy3O1VtSxGj79/U86opaSuw+iCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACvS/AHgxWSLU9Xjzn5oYGH5Mw/kKq/Djwn9rdNV1GPNupzDGw++f7x9q9VrixFe3uRPmM4zVxvh6D9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w0z7Jbm6+0hjOXOcYwcjn/AD61zdFFAHo994gsNKg8M3Js4726t9PXy2Wfb5b4xhgAc/TisHw94ntNKu5b2fTHudQlMm+YXWxSHPPy7T/OuWooA6fSvEdjpr6jFBpcgsL6FY3i+1HepGeQ+3vnpipbvWH8R3mkRWVvFYXlmuyKVrjEYVeV+8OCMdcnNcnRQB2XxF1m21DW4ILby5bK0yW8lsLJIzbpCD7njPtUNz4k0mbQ49KGhzLbxSNLGftxJDkYyfk569K5OigDqtL8R6XYaPdWH9iyyLdpGtw323G8pzkDZxyTxVbSta0+x83/iWzq3mmSKW3vGikVeyM2DuA9cCueooA6aLxbOnjM+IDbRlyeYA2Bt2bcZ9cd/WsfVp7G4mVtNspLOMD5lefzSTnrnAxVGigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD//2Q==";

      const json = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistInfo?.id}/images`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "image/jpeg",
          },
          body: base64String,
        }
      );

      if (json) {
        if (json.status != 202) {
          console.log(json);
        }
      }

      handleFormWindow(4);
      setIsLoading(false);
    };

    if (snapshot) {
      uploadImage();
    }
  }, [snapshot]);

  // dot animations
  useEffect(() => {
    if (!error) {
      gsap.fromTo(
        "#page",
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1, duration: 0.5 }
      );

      var tl = gsap.timeline({ repeat: -1 });

      // dots appearing
      tl.fromTo("#first", { opacity: 0 }, { opacity: 1, duration: 0.3 });
      tl.fromTo("#second", { opacity: 0 }, { opacity: 1, duration: 0.3 });
      tl.fromTo("#third", { opacity: 0 }, { opacity: 1, duration: 0.3 });

      // dots disappearing
      tl.to("#first", { opacity: 0, duration: 0.3 });
      tl.to("#second", { opacity: 0, duration: 0.3 });
      tl.to("#third", { opacity: 0, duration: 0.3 });

      gsap.to("#state", { opacity: 1, duration: 0.4 });
    }
  }, [error]);

  return (
    <div
      className="w-screen h-screen flex flex-col justify-center items-center opacity-0 px-8 text-center"
      id="page"
    >
      {error && <div>{error}</div>}
      {!error && (
        <>
          <div className="text-8xl flex gap-2">
            <span id="first" className="opacity-0">
              .
            </span>
            <span id="second" className="opacity-0">
              .
            </span>
            <span id="third" className="opacity-0">
              .
            </span>
          </div>
          <div className="mt-8 opacity-0" id="state">
            {cookingState}
          </div>
        </>
      )}
    </div>
  );
}
