/* TranslationPacker - Decompiled by JODE
 * Visit http://jode.sourceforge.net/
 */
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FilenameFilter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.util.jar.JarEntry;
import java.util.jar.JarOutputStream;

public class TranslationPacker
{
    FileOutputStream new_stream = null;
    JarOutputStream new_out = null;
    String base_folder;
    String fOutputJAR;

    class TransFilter implements FilenameFilter
    {
        public boolean accept(File file, String string)
        {
            return (new File
                    (file.getAbsolutePath() + File.separatorChar + string)
                    .isDirectory()
                    || string.endsWith(".translation"));
        }
    }

    public TranslationPacker(String string)
    {
        ((TranslationPacker) this).fOutputJAR = string;
    }

    public void PackTranslationFiles(String string) throws IOException
    {
        ((TranslationPacker) this).new_stream
        = new FileOutputStream(((TranslationPacker) this).fOutputJAR);
        ((TranslationPacker) this).new_out
        = new JarOutputStream(((TranslationPacker) this).new_stream);
        ((TranslationPacker) this).base_folder
        = new File(string).getAbsolutePath() + File.separatorChar;
        ProcessFolder(string);
        ((TranslationPacker) this).new_out.close();
        ((TranslationPacker) this).new_stream.close();
    }

    public void ProcessFolder(String string)
    {
        Object object = null;
        int i = 0;
        for (File[] files = new File(string).listFiles(new TransFilter());
                files != null && i < files.length; i++)
        {
            if (files[i].isDirectory())
                ProcessFolder(files[i].getAbsolutePath());
            else
            {
                System.out.println("Pack file: " + files[i].getAbsolutePath());
                try
                {
                    ProcessFile(files[i].getAbsolutePath());
                }
                catch (IOException ioexception)
                {
                    ioexception.printStackTrace();
                }
            }
        }
    }

    public static String ConvertText(String string)
    {
        String string_0_ = "";
        for (int i = 0; i < string.length(); i++)
        {
            char c = string.charAt(i);
            if (c >= '\u007f')
            {
                String string_1_ = Integer.toHexString(c);
                switch (string_1_.length())
                {
                case 1:
                    string_1_ = "\\u000" + string_1_;
                    break;
                case 2:
                    string_1_ = "\\u00" + string_1_;
                    break;
                case 3:
                    string_1_ = "\\u0" + string_1_;
                    break;
                case 4:
                    string_1_ = "\\u" + string_1_;
                    break;
                default:
                    throw new RuntimeException
                    (string_1_ + " is too long to be a Character");
                }
                string_0_ += (String) string_1_;
            }
            else
                string_0_ += (char) c;
        }
        return string_0_;
    }

    public void ProcessFile(String string) throws IOException
    {
        Object object = null;
        String string_2_ = "";
        if (string.endsWith(".properties.translation"))
        {
            String string_3_
            = System.setProperty("line.separator", String.valueOf('\n'));
            System.out.println("oldcrlf: " + string_3_);
            JarEntry jarentry
            = new JarEntry(string.replace
                           (((TranslationPacker) this).base_folder, "")
                           .replace
                           (".translation", "").replace('\\', '/'));
            jarentry.setTime(new File(string).lastModified());
            String string_4_ = "UTF-8";
            FileInputStream fileinputstream = new FileInputStream(string);
            UnicodeInputStream unicodeinputstream
            = new UnicodeInputStream(fileinputstream, string_4_);
            string_4_ = unicodeinputstream.getEncoding();
            InputStreamReader inputstreamreader;
            if (string_4_ == null)
                inputstreamreader = new InputStreamReader(unicodeinputstream);
            else
                inputstreamreader
                = new InputStreamReader(unicodeinputstream, string_4_);
            BufferedReader bufferedreader
            = new BufferedReader(inputstreamreader);
            String string_5_ = "";
            String string_6_;
            while ((string_6_ = bufferedreader.readLine()) != null)
            {
                string_2_ += (String) string_5_ + (String) string_6_;
                string_5_ = "\n";
            }
            bufferedreader.close();
            fileinputstream.close();
            String string_7_ = ConvertText(string_2_);
            ((TranslationPacker) this).new_out.putNextEntry(jarentry);
            BufferedWriter bufferedwriter
            = (new BufferedWriter
               (new OutputStreamWriter(((TranslationPacker) this).new_out,
                                       "US-ASCII")));
            bufferedwriter.write(string_7_);
            bufferedwriter.flush();
        }
        else
        {
            FileInputStream fileinputstream = new FileInputStream(string);
            BufferedReader bufferedreader
            = new BufferedReader(new InputStreamReader(fileinputstream,
                                 "UTF-8"));
            String string_8_ = "";
            String string_9_;
            while ((string_9_ = bufferedreader.readLine()) != null)
            {
                if (string_9_.contains("\t"))
                {
                    string_2_ += (String) string_8_ + (String) string_9_;
                    string_8_ = "\r\n";
                }
            }
            bufferedreader.close();
            fileinputstream.close();
            if (string_2_ != "")
            {
                JarEntry jarentry
                = new JarEntry(string.replace
                               (((TranslationPacker) this).base_folder,
                                "")
                               .replace
                               (".translation", ".class")
                               .replace('\\', '/'));
                jarentry.setTime(new File(string).lastModified());
                ((TranslationPacker) this).new_out.putNextEntry(jarentry);
                BufferedWriter bufferedwriter
                = new BufferedWriter(new OutputStreamWriter
                                     (((TranslationPacker) this).new_out,
                                      "UTF-8"));
                bufferedwriter.write(string_2_);
                bufferedwriter.flush();
            }
        }
    }
}
