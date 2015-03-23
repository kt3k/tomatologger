
set :css_dir, 'css'

set :js_dir, 'js'

set :images_dir, 'img'

set :build_dir, 'public'

set :api_host, 'http://localhost:18000'

ready do

  sprockets.append_path File.join root, 'bower_components'

end

configure :build do

  activate :minify_css

  activate :minify_javascript

  set :api_host, ''

end
