require "rails_helper"

RSpec.describe CommentsController, type: :routing do
  describe "routing" do

    it "routes to #index" do
      expect(:get => "/posts/1/comments").to route_to({
        "controller" => "comments",
        "action" => "index",
        "post_id" => "1"
      })

    end

    it "routes to #create" do
      expect(:post => "/posts/1/comments").to route_to({
        "controller" => "comments",
        "action" => "create",
        "post_id" => "1"
      })
    end

  end
end
