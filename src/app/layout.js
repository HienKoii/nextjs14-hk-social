import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/globals.css";

import 'react-chat-elements/dist/main.css';
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/plugins/counter.css";


import { UserProvider } from "@/src/context/UserContext";
import { PostsProvider } from "@/src/context/PostsContext";
import { FriendsProvider } from "@/src/context/FriendsContext";
import Main from "./main";
import { SocketProvider } from "../context/SocketContext";
import NotificationsProvider from "../context/NotificationsContext";
import ProfileProvider from "../context/ProfileContext";

export const metadata = {
  title: "Facebook Clone",
  description: "A Facebook clone using Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-light">
        <>
          <SocketProvider>
            <UserProvider>
              <FriendsProvider>
                <ProfileProvider>
                  <NotificationsProvider>
                    <PostsProvider>
                      <Main>{children}</Main>
                    </PostsProvider>
                  </NotificationsProvider>
                </ProfileProvider>
              </FriendsProvider>
            </UserProvider>
          </SocketProvider>
        </>
      </body>
    </html>
  );
}
