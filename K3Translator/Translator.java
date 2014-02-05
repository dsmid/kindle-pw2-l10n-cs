/* Translator - Decompiled by JODE
 * Visit http://jode.sourceforge.net/
 */
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;

public class Translator
{
    public static String LoadKeyb(String string) throws IOException
    {
        String string_0_
        = "\u0430\u0431\u0432\u0433\u0434\u0435\u0436\u0437\u0438\u0439\u043a\u043b\u043c\u043d\u043e\u043f\u0440\u0441\u0442\u0443\u0444\u0445\u0446\u0447\u0448\u0449\u044a\u044b\u044c\u044d\u044e\u044f\u0456\u0454\u0457\u04911234567890-=\u0410\u0411\u0412\u0413\u0414\u0415\u0416\u0417\u0418\u0419\u041a\u041b\u041c\u041d\u041e\u041f\u0420\u0421\u0422\u0423\u0424\u0425\u0426\u0427\u0428\u0429\u042a\u042b\u042c\u042d\u042e\u042f\u0406\u0404\u0407\u0490\u0401\u0451\u040e\u045e\u00a9\u00ae#\u2116";
        int i = 0;
        Object object = null;
        for (File[] files = new File(string).listFiles(new KeybFilter());
                files != null && i < files.length; i++)
        {
            System.out
            .println("Loading keyb file: " + files[i].getAbsolutePath());
            String string_1_ = "UTF-8";
            FileInputStream fileinputstream
            = new FileInputStream(files[i].getAbsolutePath());
            UnicodeInputStream unicodeinputstream
            = new UnicodeInputStream(fileinputstream, string_1_);
            string_1_ = unicodeinputstream.getEncoding();
            InputStreamReader inputstreamreader;
            if (string_1_ == null)
                inputstreamreader = new InputStreamReader(unicodeinputstream);
            else
                inputstreamreader
                = new InputStreamReader(unicodeinputstream, string_1_);
            BufferedReader bufferedreader
            = new BufferedReader(inputstreamreader);
            String string_2_ = "";
            String string_3_;
            while ((string_3_ = bufferedreader.readLine()) != null)
                string_2_ += (String) string_3_;
            JarWalker.replace(string_2_, "\n", "");
            JarWalker.replace(string_2_, "\r", "");
            if (string_2_.length() != 0)
            {
                string_0_ = string_2_;
                break;
            }
        }
        return string_0_;
    }

    public static String FindKeyb(String string) throws IOException
    {
        Object object = null;
        File[] files = new File(string).listFiles(new KeybFilter());
        if (files != null)
        {
            System.out
            .println("Using keyb file: " + files[0].getAbsolutePath());
            return files[0].getAbsolutePath();
        }
        return "";
    }

    public static void main(String[] strings) throws IOException
    {
        if (strings[0].equalsIgnoreCase("tj"))
        {
            System.out.println("Translate JAR called:");
            System.out.println("- Source JAR file: " + strings[1]);
            System.out.println("- Translation JAR file: " + strings[2]);
            System.out.println("- Destination folder: " + strings[3]);
            System.out.println("- Keyb file folder: " + strings[4]);
            new JarWalker().ProcessJAR(strings[1], strings[2], strings[3],
                                       LoadKeyb(strings[4]));
        }
        else if (strings[0].equalsIgnoreCase("tj4"))
        {
            System.out.println("Translate JAR for K4 called:");
            System.out.println("- Source JAR file: " + strings[1]);
            System.out.println("- Translation JAR file: " + strings[2]);
            System.out.println("- Destination folder: " + strings[3]);
            System.out.println("- Lang From: " + strings[4]);
            System.out.println("- Lang To: " + strings[5]);
            new JarWalker().ProcessJAR4(strings[1], strings[2], strings[3],
                                        strings[4], strings[5]);
        }
        else if (strings[0].equalsIgnoreCase("keyb"))
        {
            System.out.println("Translate Keyboard called:");
            System.out.println("- Source JAR file: " + strings[1]);
            System.out.println("- Destination folder: " + strings[2]);
            System.out.println("- Keyb file folder: " + strings[3]);
            new JarWalker().ProcessKEYB(strings[1], strings[2],
                                        LoadKeyb(strings[3]));
        }
        else if (strings[0].equalsIgnoreCase("tprefs"))
        {
            System.out.println("Translate preferences file called:");
            System.out.println("- Source prefs file: " + strings[1]);
            System.out.println("- Destination file: " + strings[2]);
            System.out.println("- File with translation: " + strings[3]);
            new JarWalker().ProcessPREFS(strings[1], strings[2], strings[3]);
        }
        else if (strings[0].equalsIgnoreCase("td"))
        {
            System.out.println("Translate JAR directory called:");
            System.out.println("- Source folder file: " + strings[1]);
            System.out.println("- Translation JAR file: " + strings[2]);
            System.out.println("- Destination folder: " + strings[3]);
            System.out.println("- Keyb file folder: " + strings[4]);
            Object object = null;
            int i = 0;
            for (File[] files
                    = new File(strings[1]).listFiles(new JARFilter());
                    files != null && i < files.length; i++)
            {
                System.out
                .println("Translate JAR: " + files[i].getAbsolutePath());
                new JarWalker().ProcessJAR(files[i].getAbsolutePath(),
                                           strings[2], strings[3],
                                           LoadKeyb(strings[4]));
            }
            System.out.println("Processed JARs: " + new Integer(i).toString());
        }
        else if (strings[0].equalsIgnoreCase("td4"))
        {
            System.out.println("Translate JAR4 directory called:");
            System.out.println("- Source folder file: " + strings[1]);
            System.out.println("- Translation JAR file: " + strings[2]);
            System.out.println("- Lang From: " + strings[3]);
            System.out.println("- Lang To: " + strings[4]);
            Object object = null;
            int i = 0;
            String filter = strings[3];
            if (filter.equals("de"))
            {
                filter = "de_DE";
            }
            for (File[] files = new File(strings[1])
            .listFiles(new JAR4Filter(filter));
                    files != null && i < files.length; i++)
            {
                System.out
                .println("Translate JAR4: " + files[i].getAbsolutePath());
                new JarWalker().ProcessJAR4(files[i].getAbsolutePath(),
                                            strings[2], files[i].getParent(),
                                            strings[3], strings[4]);
            }
            System.out.println("Processed JARs: " + new Integer(i).toString());
        }
        else if (strings[0].equalsIgnoreCase("keyb4"))
        {
            System.out.println("Translate Keyboard4 called:");
            System.out.println("- Source JAR: " + strings[1]);
            System.out.println("- Keyb file folder: " + strings[2]);
            System.out.println("- Lang From: " + strings[3]);
            System.out.println("- Lang To: " + strings[4]);
            new JarWalker().ProcessKEYB4(FindKeyb(strings[2]), strings[1],
                                         strings[3], strings[4]);
        }
        else if (strings[0].equalsIgnoreCase("es"))
        {
            System.out.println("Extract strings called:");
            System.out.println("- Source folder or file: " + strings[1]);
            System.out.println("- Destination folder is: " + strings[2]);
            if (new File(strings[1]).isDirectory())
            {
                Object object = null;
                int i = 0;
                for (File[] files
                        = new File(strings[1]).listFiles(new JARFilter());
                        files != null && i < files.length; i++)
                {
                    System.out.println("Extracting strings from JAR: "
                                       + files[i].getAbsolutePath());
                    new StringExtractor()
                    .ProcessJAR(files[i].getAbsolutePath(), strings[2]);
                }
            }
            else
            {
                System.out
                .println("Extracting strings from JAR: " + strings[0]);
                new StringExtractor().ProcessJAR(strings[1], strings[2]);
            }
        }
        else if (strings[0].equalsIgnoreCase("mt"))
        {
            System.out.println("Make translation JAR called:");
            System.out.println("- Source folder is: " + strings[1]);
            System.out.println("- Destination JAR file is: " + strings[2]);
            try
            {
                new TranslationPacker(strings[2])
                .PackTranslationFiles(strings[1]);
            }
            catch (IOException ioexception)
            {
                ioexception.printStackTrace();
            }
        }
    }
}
