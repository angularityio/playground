class CommentsController < ApplicationController
  before_action :set_post, only: [:index, :create]

  # GET /comments
  def index
    @comments = @post.comments.all
    render json: @comments
  end

  # POST /comments
  def create
    @comment = @post.comments.new(comment_params)

    if @comment.save
      render json: @comment, status: :created
    else
      render json: @comment.errors, status: :unprocessable_entity
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_post
      @post = Post.find(params[:post_id])
    end

    # Only allow a trusted parameter "white list" through.
    def comment_params
      params.require(:comment).permit(:content)
    end
end
