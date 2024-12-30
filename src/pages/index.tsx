// index.tsx
import * as React from "react";
import { graphql, HeadFC, PageProps } from "gatsby"; 
import Whiteboards from "../components/whiteboard";
import {useUser} from "../content/userContext";
import Login from "./login";
interface Whiteboard {
  id: string;
  image_url: string;
}

interface GraphQLData {
  allWhiteboardsCsv: {
    edges: {
      node: Whiteboard;
    }[];
  };
}

const IndexPage: React.FC<PageProps<GraphQLData>> = ({ data }) => {
  const { user } = useUser();

  return (
    <main className="min-h-screen">
      {user ? (
        <div
         className="min-h-screen bg-[#E9FBD6] text-[#334E68] p-5 min-h-screen"
        >
          <h1 className="font-gotham-rounded-bold text-[31px] tracking-tightest text-center">
            Goblin Challenge
          </h1>
          <p className="font-gotham-rounded-medium text-lg text-center text-gray-700 mb-6">
            Start by clicking the top-left of text, then the bottom-right
          </p>
          <Whiteboards data={data} />
        </div>
      ) : (
        <Login />
      )}
    </main>
  );
};

export default IndexPage;

export const Head: HeadFC = () => <title>Home Page</title>;

export const query = graphql`
  query {
    allWhiteboardsCsv {
      edges {
        node {
          id
          image_url
        }
      }
    }
  }
`;