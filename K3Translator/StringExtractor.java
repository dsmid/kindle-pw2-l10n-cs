/* StringExtractor - Decompiled by JODE
 * Visit http://jode.sourceforge.net/
 */
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;
import java.util.Enumeration;
import java.util.jar.JarEntry;
import java.util.jar.JarFile;

import org.apache.bcel.classfile.ClassFormatException;
import org.apache.bcel.classfile.ClassParser;
import org.apache.bcel.classfile.Code;
import org.apache.bcel.classfile.Constant;
import org.apache.bcel.classfile.ConstantPool;
import org.apache.bcel.classfile.ConstantUtf8;
import org.apache.bcel.classfile.JavaClass;
import org.apache.bcel.classfile.Method;
import org.apache.bcel.generic.ClassGen;
import org.apache.bcel.generic.ICONST;
import org.apache.bcel.generic.InstructionFactory;
import org.apache.bcel.generic.InstructionList;
import org.apache.bcel.generic.Type;

public class StringExtractor
{
    public static int BUFFER_SIZE = 10240;

    static String changeExtension(String string, String string_0_)
    {
        int i = string.lastIndexOf(".");
        if (i != -1)
            return string.substring(0, i) + string_0_;
        return string + string_0_;
    }

    public void ProcessJAR(String string, String string_1_)
    {
        try
        {
            byte[] is = new byte[BUFFER_SIZE];
            JarFile jarfile = new JarFile(string);
            int i = 0;
            Enumeration enumeration = jarfile.entries();
            while (enumeration.hasMoreElements())
            {
                JarEntry jarentry = (JarEntry) enumeration.nextElement();
                if (!jarentry.isDirectory()
                        && (jarentry.getName().endsWith(".class")
                            || jarentry.getName().endsWith(".properties")))
                {
                    System.out.println
                    ("Extract file: "
                     + jarentry.getName().replace('/', File.separatorChar)
                     + " to: " + string_1_ + File.separatorChar
                     + jarentry.getName().replace('/',
                                                  File.separatorChar));
                    File file
                    = new File(string_1_ + File.separatorChar
                               + jarentry.getName()
                               .replace('/', File.separatorChar));
                    new File(file.getParent()).mkdirs();
                    file.createNewFile();
                    FileOutputStream fileoutputstream
                    = new FileOutputStream(file);
                    InputStream inputstream = jarfile.getInputStream(jarentry);
                    int i_2_;
                    while ((i_2_ = inputstream.read(is)) != -1)
                        fileoutputstream.write(is, 0, i_2_);
                    fileoutputstream.close();
                    inputstream.close();
                    if (jarentry.getName().endsWith(".class"))
                    {
                        ProcessClass(file.getAbsolutePath());
                        file.delete();
                    }
                }
            }
            System.out.println("Processed: " + new Integer(i).toString());
        }
        catch (IOException ioexception)
        {
            ioexception.printStackTrace();
        }
    }

    public static void printCode(Method[] methods, ClassGen classgen)
    {
        for (int i = 0; i < methods.length; i++)
        {
            Code code = methods[i].getCode();
            if (code != null
                    && (methods[i].toString().equals
                        ("public void <init>(com.amazon.ebook.framework.gui.foundation.b a, boolean a, boolean a)")))
            {
                System.out.println("Method found, patch it!");
                System.out.println("Old code:\r\n" + code);
                InstructionList instructionlist
                = new InstructionList(code.getCode());
                InstructionFactory instructionfactory
                = new InstructionFactory(classgen);
                instructionlist.append
                (instructionlist.insert(instructionlist.findHandle(4),
                                        new ICONST(1)),
                 (instructionfactory.createPutStatic
                  ("com.amazon.ebook.framework.gui.foundation.SymbolPopup",
                   "ADVANCED_MODE_CONFIGURED", Type.BOOLEAN)));
                code.setCode(instructionlist.getByteCode());
                System.out.println("New code:\r\n" + code);
            }
        }
    }

    public boolean ProcessClass(String string) throws IOException
    {
        ClassParser classparser = null;
        JavaClass javaclass = null;
        Object object = null;
        OutputStreamWriter outputstreamwriter = null;
        System.out.println("Extracting strings from: " + string);
        FileOutputStream fileoutputstream
        = new FileOutputStream(changeExtension(string, ".strings"));
        try
        {
            outputstreamwriter
            = new OutputStreamWriter(fileoutputstream, "UTF-8");
        }
        catch (UnsupportedEncodingException unsupportedencodingexception)
        {
            unsupportedencodingexception.printStackTrace();
        }
        try
        {
            classparser = new ClassParser(string);
        }
        catch (IOException ioexception)
        {
            ioexception.printStackTrace();
        }
        try
        {
            javaclass = classparser.parse();
        }
        catch (ClassFormatException classformatexception)
        {
            classformatexception.printStackTrace();
        }
        catch (IOException ioexception)
        {
            ioexception.printStackTrace();
        }
        ConstantPool constantpool = javaclass.getConstantPool();
        for (int i = 1; i < constantpool.getLength(); i++)
        {
            Constant constant = constantpool.getConstant(i);
            if (constant != null && constant.getTag() == 1)
            {
                ConstantUtf8 constantutf8 = (ConstantUtf8) constant;
                String string_3_ = constantutf8.getBytes().replace
                                   ("\n", "~~").replace("\r", "$$");
                outputstreamwriter.write(string_3_ + "\r\n");
            }
        }
        outputstreamwriter.close();
        return true;
    }
}
