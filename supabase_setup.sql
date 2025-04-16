-- Software Developed by Trevias Xk
-- Social Networks:     treviasxk
-- Github:              https://github.com/treviasxk

-- Create table for devblog
DROP TABLE IF EXISTS public.blog;
CREATE TABLE public.blog (
  id bigint generated by default as identity not null,
  pin boolean null default false,
  title text null,
  tags text null,
  content text null,
  view bigint not null,
  date timestamp with time zone not null default now(),
  constraint blog_pkey primary key (id)
) TABLESPACE pg_default;

-- Create policies for users
DROP POLICY IF EXISTS "DevBlog Select" ON public.blog;
CREATE POLICY "DevBlog Select" 
ON public.blog 
FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "DevBlog Insert" ON public.blog;
CREATE POLICY "DevBlog Insert"
ON public.blog 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

DROP POLICY IF EXISTS "DevBlog Update" ON public.blog;
CREATE POLICY "DevBlog Update"
ON public.blog 
FOR UPDATE 
TO authenticated 
USING (true);

DROP POLICY IF EXISTS "DevBlog Delete" ON public.blog;
CREATE POLICY "DevBlog Delete"
ON public.blog 
FOR DELETE 
TO authenticated 
USING (true);

-- Create function for request
DROP FUNCTION IF EXISTS GetBlogContent(query text, tag text, max int8, range int8, next int8);
CREATE FUNCTION GetBlogContent(query text, tag text, max int8, range int8, next int8)
RETURNS TABLE (id int8, pin bool, title text, tags text, views int8, date timestamptz, content text) AS $$
BEGIN
    RETURN QUERY EXECUTE format('SELECT blog.id, blog.pin, blog.title, blog.tags, blog.views, blog.date, SUBSTRING(blog.content, 1, %s) || CASE WHEN LENGTH(blog.content) > %s THEN ''...'' ELSE '''' END AS content FROM blog WHERE blog.title ilike ''%s'' AND blog.tags ilike ''%s'' ORDER BY blog.pin DESC, blog.id DESC LIMIT %s OFFSET %s;', max, max, query, tag, range, next);
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS GetBlogContent(post int8);
CREATE FUNCTION GetBlogContent(post int8)
RETURNS TABLE (id int8, pin bool, title text, tags text, views int8, content text, date timestamptz) AS $$
BEGIN
    -- Increase +1 in views from post
    EXECUTE format('UPDATE blog SET views = views + 1 WHERE id = %L', post);

    -- Retorna data post
    RETURN QUERY EXECUTE format(
        'SELECT id, pin, title, tags, views, content, date 
         FROM blog 
         WHERE id = %L',
        post
    );
END;
$$ LANGUAGE plpgsql;