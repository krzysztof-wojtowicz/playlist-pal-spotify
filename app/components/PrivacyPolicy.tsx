"use client";

// next imports
import { useState } from "react";

export default function PrivacyPolicy() {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  return (
    <>
      <div className="text-primary w-full md:w-1/2 lg:w-1/3 flex-col justify-center items-center gap-6 text-xs pb-8 px-6 text-center footer">
        <div
          className="flex items-center justify-center mb-6 gap-4 hover:cursor-pointer hover:underline"
          onClick={() => {
            setIsVisible(!isVisible);
          }}
        >
          <div>Privacy Policy</div>
        </div>
        {isVisible && (
          <div className="flex-col items-center justify-center gap-6">
            <section className="mb-6">
              <h2 className="font-semibold text-gray-700 mb-2">
                1. Introduction
              </h2>
              <p className="text-gray-600">
                This Privacy Policy explains how our web app accesses and
                processes your data when using the Spotify API. We are committed
                to being transparent about the data we use and ensuring your
                privacy is protected.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="font-semibold text-gray-700 mb-2">
                2. Data We Access and Use
              </h2>
              <ul className="list-disc pl-5 text-gray-600">
                <li>
                  <strong>Account Information:</strong> We retrieve your country
                  location to ensure the content we fetch is relevant to your
                  Spotify market. We do not use or store any other account
                  information.
                </li>
                <li>
                  <strong>Playlist and Image Permissions:</strong> We request
                  access to create new playlists on your behalf, add tracks to
                  them, and update their cover images.
                </li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="font-semibold text-gray-700 mb-2">
                3. Data Storage and Processing
              </h2>
              <p className="text-gray-600">
                - We do <span className="font-semibold">not</span> store any
                user data on our servers. <br />- We do{" "}
                <span className="font-semibold">not</span> collect, process, or
                share any personal information beyond what is necessary to
                operate the app.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="font-semibold text-gray-700 mb-2">
                4. Third-Party Sharing
              </h2>
              <p className="text-gray-600">
                We do <span className="font-semibold">not</span> share your data
                with any third parties. All data is processed solely for
                interacting with your Spotify account as intended by the app.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="font-semibold text-gray-700 mb-2">
                5. Communication
              </h2>
              <p className="text-gray-600">
                We will <span className="font-semibold">not</span> email you.
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-gray-700 mb-2">
                6. Changes to This Policy
              </h2>
              <p className="text-gray-600">
                We may update this Privacy Policy as needed. Any changes will be
                reflected in the app, and continued use will constitute
                acceptance of the updated policy.
              </p>
            </section>
          </div>
        )}
      </div>
    </>
  );
}
